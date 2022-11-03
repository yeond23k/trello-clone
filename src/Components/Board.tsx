import { useRef, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { ITodo, toDoState } from "../atoms";
import DraggableCard from "./DraggableCard";

const Wrapper = styled.div`
  width: 300px;
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  font-size: 18px;
`;

interface IAreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
      ? "#b2bec2"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
  }
`;

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
}

interface IForm {
  toDo: string;
}

interface IForm2 {
  boardTitle: string;
}

const Board = ({ toDos, boardId }: IBoardProps) => {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const {
    register: register2,
    setValue: setValue2,
    handleSubmit: handleSubmit2,
  } = useForm<IForm2>();
  const [isEdit, setIsEdit] = useState(false);
  const inputTitleRef = useRef<HTMLInputElement>(null);

  const onValid = ({ toDo }: IForm) => {
    console.log(toDo);
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      return allBoards.map((board) => {
        return board.boardId === boardId
          ? { ...board, data: [...board.data, newToDo] }
          : board;
      });
    });
    setValue("toDo", "");
  };

  const handleOnClick = (boardId: string) => {
    console.log(boardId);
    setValue2("boardTitle", boardId);
    setIsEdit((prev) => !prev);
  };

  const onValidTitle = ({ boardTitle }: IForm2) => {
    setToDos((allBoards) => {
      return allBoards.map((board) => {
        return board.boardId === boardId
          ? { ...board, boardId: boardTitle }
          : board;
      });
    });
    setValue2("boardTitle", "");
    setIsEdit((prev) => !prev);
  };

  return (
    <Wrapper>
      <Header>
        <span>test</span>
        {isEdit ? (
          <Form onSubmit={handleSubmit2(onValidTitle)}>
            <input
              {...register2("boardTitle", { required: true })}
              type="text"
              onBlur={() => setIsEdit((prev) => !prev)}
            />
          </Form>
        ) : (
          <Title onClick={() => handleOnClick(boardId)}>{boardId}</Title>
        )}
        <span>test</span>
      </Header>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register("toDo", { required: true })}
          type="text"
          placeholder={`Add task on ${boardId}`}
        />
      </Form>
      <Droppable droppableId={boardId}>
        {(provided, snapshot) => (
          <Area
            isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            isDraggingOver={snapshot.isDraggingOver}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DraggableCard
                key={toDo.id}
                index={index}
                toDoId={toDo.id}
                toDoText={toDo.text}
                boardId={boardId}
              />
            ))}
            {provided.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
};

export default Board;
