/**
 * @fileoverview Root application module that bootstraps and configures all feature modules.
 *
 * @description
 * This file defines the AppModule, which is the root module of the NestJS application.
 * It imports and configures all necessary modules including configuration, internationalization,
 * database, scheduling, and feature modules (auth, movies, rooms, sessions, payments).
 *
 * @module app.module
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MoviesModule } from './modules/movies/movies.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { DatabaseModule } from './shared/database/database.module';
import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { ClsModule } from 'nestjs-cls';
import { DB_PROVIDER } from './shared/database/database.provider';
import { ScheduleModule } from '@nestjs/schedule';
import { PaymentsModule } from './modules/payments/payments.module';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { join } from 'node:path';

/**
 * Root application module that configures and orchestrates all feature modules.
 *
 * @description
 * The AppModule serves as the entry point for the NestJS application, configuring:
 * - **ConfigModule**: Global configuration management with environment variables
 * - **I18nModule**: Internationalization support with multiple language resolvers
 * - **DatabaseModule**: Database connection and Drizzle ORM setup
 * - **ClsModule**: Continuation-local storage with transactional support for Drizzle ORM
 * - **ScheduleModule**: Task scheduling capabilities
 * - **Feature Modules**: AuthModule, MoviesModule, RoomsModule, SessionsModule, PaymentsModule
 *
 * @class AppModule
 * @decorator Module
 *
 * @example
 * // Bootstrap the application in main.ts
 * const app = await NestFactory.create(AppModule);
 * await app.listen(process.env.PORT ?? 3333);
 */
@Module({
  imports: [
    /**
     * Global configuration module that loads environment variables.
     * Setting `isGlobal: true` makes ConfigService available throughout the application.
     */
    ConfigModule.forRoot({ isGlobal: true }),

    /**
     * Internationalization module configured asynchronously to access ConfigService.
     * Supports language resolution via query parameter, Accept-Language header, and x-lang header.
     */
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.getOrThrow('FALLBACK_LANGUAGE'),
        loaderOptions: {
          path: join(__dirname, '..', '/i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      inject: [ConfigService],
    }),

    /** Database module providing Drizzle ORM connection and schema. */
    DatabaseModule,

    /**
     * Continuation-local storage module with transactional plugin.
     * Enables automatic transaction management across async operations using Drizzle ORM.
     */
    ClsModule.forRoot({
      global: true,
      plugins: [
        new ClsPluginTransactional({
          imports: [DatabaseModule],
          adapter: new TransactionalAdapterDrizzleOrm({
            drizzleInstanceToken: DB_PROVIDER,
          }),
        }),
      ],
    }),

    /** Schedule module for cron jobs and task scheduling. */
    ScheduleModule.forRoot(),

    /** Authentication and authorization module. */
    AuthModule,

    /** Movies management feature module. */
    MoviesModule,

    /** Rooms management feature module. */
    RoomsModule,

    /** Sessions management feature module. */
    SessionsModule,

    /** Payments processing feature module. */
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
