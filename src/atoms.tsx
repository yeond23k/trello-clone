import { atom } from "recoil";

export interface ITodo {
  id: number;
  text: string;
}

export interface IToDoState {
  boardId: string;
  data: ITodo[];
}

export const toDoState = atom<IToDoState[]>({
  key: "toDo",
  default: [],
});
