import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { toDoState } from "../atoms";

const Wrapper = styled.div`
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

const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
  }
`;

interface IForm {
  boardTitle: string;
}

interface IHeaderProps {
  boardId: string;
}

const Header = ({ boardId }: IHeaderProps) => {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const [isEdit, setIsEdit] = useState(false);

  const handleOnClick = (boardId: string) => {
    console.log(boardId);
    setValue("boardTitle", boardId);
    setIsEdit((prev) => !prev);
  };

  const onValidTitle = ({ boardTitle }: IForm) => {
    setToDos((allBoards) => {
      return allBoards.map((board) => {
        return board.boardId === boardId
          ? { ...board, boardId: boardTitle }
          : board;
      });
    });
    setValue("boardTitle", "");
    setIsEdit((prev) => !prev);
  };

  const handleDeleteAllToDos = (boardId: string) => {
    setToDos((allBoards) => {
      return allBoards.map((board) => {
        return board.boardId === boardId ? { ...board, data: [] } : board;
      });
    });
  };

  const handleDeleteBoard = (boardId: string) => {
    setToDos((allBoards) => {
      return allBoards.filter((board) => board.boardId !== boardId);
    });
  };

  return (
    <Wrapper>
      <span onClick={() => handleDeleteBoard(boardId)}>❎</span>
      {isEdit ? (
        <Form onSubmit={handleSubmit(onValidTitle)}>
          <input
            {...register("boardTitle", { required: true })}
            type="text"
            onBlur={() => setIsEdit((prev) => !prev)}
          />
        </Form>
      ) : (
        <Title onClick={() => handleOnClick(boardId)}>{boardId}</Title>
      )}
      <span onClick={() => handleDeleteAllToDos(boardId)}>전체삭제</span>
    </Wrapper>
  );
};

export default Header;
