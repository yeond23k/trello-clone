import { useEffect } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";
import plusButton from "./assets/plusButton.png";

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
`;

const ButtonArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  font-size: 20px;
  background-color: #4a69bd;
  padding: 5px;
  margin-top: 10px;
  width: 200px;
`;

const Image = styled.img`
  width: 50px;
`;

const App = () => {
  const [toDos, setToDos] = useRecoilState(toDoState);
  useEffect(() => {
    const object = localStorage.getItem("toDos");
    setToDos(JSON.parse(object!));
  }, []);

  useEffect(() => {
    localStorage.setItem("toDos", JSON.stringify(toDos));
  }, [toDos]);

  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      // same board movement.
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    } else {
      // cross board movement.
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination?.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);

        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination?.droppableId]: destinationBoard,
        };
      });
    }
  };

  const handleAddBoard = () => {
    setToDos((allBoards) => {
      const newBoardCount =
        Object.keys(allBoards).filter((key) => key.includes("새로운 보드"))
          .length + 1;
      return {
        ...allBoards,
        [`새로운 보드${" " + newBoardCount}`]: [],
      };
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
          ))}
        </Boards>
        <ButtonArea onClick={handleAddBoard}>
          <Image src={plusButton} />
          보드 추가하기
        </ButtonArea>
      </Wrapper>
    </DragDropContext>
  );
};

export default App;
