import {z} from 'zod'
import {Board} from '@prisma/client'
import { ActionState } from '@/lib/createSafeAction'
import { CreateBoard } from './schema'


export type InputType = z.infer<typeof CreateBoard>
export type ReturnType = ActionState<InputType,Board>