import { z } from "zod";
import {Board} from '@prisma/client'
import { ActionState } from "@/lib/createSafeAction";
import { UpdateBoard } from "./schema";

export type InputType = z.infer<typeof UpdateBoard>
export type ReturnType =ActionState<InputType,Board>