import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { getNagerApiUrl } from './utils/holidays.util';
import { IHolidayDto, NagerApiResponse } from './holiday.types';
import * as _ from 'lodash';
import { HolidayEntity } from './entities/holiday.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class HolidaysService implements OnModuleInit {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private readonly logger: Logger = new Logger(HolidaysService.name);

  async onModuleInit(): Promise<void> {
    await this.syncHolidays();
  }

  private async fetchHolidays(year?: number): Promise<IHolidayDto[]> {
    const url: string = getNagerApiUrl(year);

    try {
      const response = await fetch(url);
      const holidaysFromApi: NagerApiResponse[] =
        (await response.json()) as NagerApiResponse[];

      return holidaysFromApi.map(
        ({ name, date }: NagerApiResponse): IHolidayDto => ({
          name,
          date,
        }),
      );
    } catch (error) {
      throw new Error(`Failed to fetch holidays: ${error}`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async syncHolidays(): Promise<void> {
    this.logger.log('Syncing holidays');
    const year: number = new Date().getFullYear();

    const freshData: IHolidayDto[] = await this.fetchHolidays(year);

    const existingData: HolidayEntity[] = await HolidayEntity.find({
      select: {
        name: true,
        date: true,
      },
    });

    const existingCleaned: Pick<HolidayEntity, 'name' | 'date'>[] =
      existingData.map(({ name, date }) => ({
        name,
        date,
      }));

    const isTheSame: boolean = _.isEqual(
      _.sortBy(freshData, ['date']),
      _.sortBy(existingCleaned, ['date']),
    );

    if (!isTheSame) {
      this.logger.log('Fetching holidays from API');
      await this.dataSource.manager.transaction(
        async (manager: EntityManager) => {
          await manager.clear(HolidayEntity);

          const entitiesToSave: HolidayEntity[] = freshData.map((data) =>
            HolidayEntity.create(data),
          );
          await manager.save(entitiesToSave);
        },
      );
    }
  }
}
