import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "../atoms";

const Card = styled.div<{ isDragging: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  padding: 5px 10px;
  margin-bottom: 5px;
  background-color: ${(props) =>
    props.isDragging ? "#74b9ff" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0,0,0,0.05)" : "none"};
`;

const TextArea = styled.div``;

const ButtonArea = styled.div``;
const Button = styled.button``;

interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  boardId: string;
  index: number;
}

const DraggableCard = (props: IDraggableCardProps) => {
  const { toDoId, toDoText, boardId, index } = props;
  const setToDos = useSetRecoilState(toDoState);
  const handleDeleteItems = () => {
    setToDos((allBoards) => {
      return allBoards.map((board) => {
        return board.boardId === boardId
          ? { ...board, data: board.data.filter((toDo) => toDo.id !== toDoId) }
          : board;
      });
    });
  };
  return (
    <Draggable key={toDoId} draggableId={toDoId + ""} index={index}>
      {(provided, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <TextArea>{toDoText}</TextArea>
          <ButtonArea>
            <Button onClick={handleDeleteItems}>삭제</Button>
          </ButtonArea>
        </Card>
      )}
    </Draggable>
  );
};

export default React.memo(DraggableCard);
