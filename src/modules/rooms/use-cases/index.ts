import { CreateRoomUseCase } from './create-room.use-case';
import { FindRoomByIdUseCase } from './find-room-by-id.use-case';
import { CreateSeatUseCase } from './create-seat.use-case';
import { ListRoomsWithPaginationUseCase } from './list-rooms-with-pagination.use-case';
import { ListSeatsWithPaginationUseCase } from './list-seats-with-pagination.use-case';
import { ListSeatsUseCase } from './list-seats.use-case';

export const RoomsUseCases = [
  CreateRoomUseCase,
  FindRoomByIdUseCase,
  ListRoomsWithPaginationUseCase,
];

export const SeatsUseCases = [
  CreateSeatUseCase,
  ListSeatsUseCase,
  ListSeatsWithPaginationUseCase,
];

export * from './create-room.use-case';
export * from './find-room-by-id.use-case';
export * from './create-seat.use-case';
export * from './list-rooms-with-pagination.use-case';
export * from './list-seats-with-pagination.use-case';
export * from './list-seats.use-case';
