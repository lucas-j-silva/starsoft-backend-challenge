import { Inject } from '@nestjs/common';
import { DB_PROVIDER } from './database.provider';

export const InjectDatabase = () => Inject(DB_PROVIDER);
