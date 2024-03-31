import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const MorningBriefing = () => {

  const [weather, setWeather] = useState(null);
  const [wordOfTheDay, setWordOfTheDay] = useState('');
  const [foreignWord, setForeignWord] = useState('');
  const [mindfulQuote, setMindfulQuote] = useState('');
  const [jokeOfTheDay, setJokeOfTheDay] = useState('');
  const [news, setNews] = useState('');
  const [calendar, setCalendar] = useState('');
  const [bookRec, setBookRec] = useState('');

  const [tiles, setTiles] = useState([
    { id: 'weather', title: 'Daily Weather', content: `Temperature: ${weather}°F`, visible: true },
    { id: 'wordOfTheDay', title: 'Word of the Day', content: `${wordOfTheDay}`, visible: true },
    { id: 'foreignWord', title: 'Foreign Word of the Day', content: `${foreignWord}`, visible: true },
    { id: 'mindfulQuote', title: 'Mindfulness Quote of the Day', content: `${mindfulQuote}`, visible: true },
    { id: 'jokeOfTheDay', title: 'Joke of the Day', content: `Need a laugh: ${jokeOfTheDay}`, visible: true },
    { id: 'news', title: 'Daily News', content: `Today's Headlines: ${news}`, visible: true },
    { id: 'calendar', title: 'Calendar', content: `Today's Schedule: ${calendar}`, visible: true },
    { id: 'bookRec', title: 'Book Recommendation', content: `Here's your next read: ${bookRec}`, visible: true },
]);


useEffect(() => {
  const fetchTilesData = async () => {
      try {
          const weatherResponse = await axios.get('http://localhost:4000/api/weather');
          console.log('Weather Response:', weatherResponse.data);
          setWeather(weatherResponse.data);

          const wordOfTheDayResponse = await axios.get('http://localhost:4000/api/word-of-the-day');
          console.log('Weather Response:', wordOfTheDayResponse.data);
          setWordOfTheDay(wordOfTheDayResponse.data.word);

          const foreignWordResponse = await axios.get('http://localhost:4000/api/foreign_word_of_the_day')
          console.log('Weather Response:', foreignWordResponse.data);
          setForeignWord(foreignWordResponse.data.word);

          const mindfulQuoteResponse = await axios.get('http://localhost:4000/api/mindful_quote');
          console.log('Weather Response:', mindfulQuoteResponse.data);
          setMindfulQuote(mindfulQuoteResponse.data);

          const jokeOfTheDayResponse = await axios.get('http://localhost:4000/api/joke-of-the-day');
          console.log('Weather Response:', jokeOfTheDayResponse.data);
          setJokeOfTheDay(jokeOfTheDayResponse.data);

          const newsResponse = await axios.get('http://localhost:4000/api/news-of-the-day');
          console.log('Weather Response:', newsResponse.data);
          setNews(newsResponse.data);

          const calendarResponse = await axios.get('http://localhost:4000/api/calendar');
          console.log('Weather Response:', calendarResponse.data);
          setCalendar(calendarResponse.data);

          const bookRecResponse = await axios.get('http://localhost:4000/api/book_rec');
          console.log('Weather Response:', bookRecResponse.data);
          setBookRec(bookRecResponse.data);
      } catch (error) {
          console.error('Error fetching tiles data:', error);
      }
  };

  fetchTilesData();
}, []);

const handleDelete = (tileId) => {
  console.log('Deleting Tile ID:', tileId);
  setTiles((prevTiles) =>
      prevTiles.map((tile) =>
          tile.id === tileId ? { ...tile, visible: false } : tile
      )
  );
};


const handleReset = () => {
  // Reset all tiles to visible
  setTiles((prevTiles) =>
    prevTiles.map((tile) => ({ ...tile, visible: true }))
  );
};

const handleDragEnd = (result) => {
  if (!result.destination) return;

  const sourceIndex = result.source.index;
  const destinationIndex = result.destination.index;
  console.log('Source Index:', sourceIndex);
  console.log('Destination Index:', destinationIndex);

  const reorderedTiles = Array.from(tiles);
  const [removedTile] = reorderedTiles.splice(sourceIndex, 1);
  reorderedTiles.splice(destinationIndex, 0, removedTile);
  console.log('Reordered Tiles:', reorderedTiles);

  setTiles(reorderedTiles);
};


return (
  <div className='container mt-4'>
    <h1>Morning Briefing</h1>
    <DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId='tiles'>
    {(provided) => (
      <div {...provided.droppableProps} ref={provided.innerRef} className='row'>
        {tiles.map(({ id, title, content, visible }, index) => (
          visible && ( // Render tile only if visible
            <Draggable key={id} draggableId={id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`col-md-6 mb-4 ${snapshot.isDragging ? 'dragging' : ''}`}
                  id={id}
                >
                  <div className='card'>
                    <div className='card-body'>
                      <button
                        className='btn btn-sm btn-danger float-end'
                        onClick={() => handleDelete(id)}
                      >
                        X
                      </button>
                      <h5 className='card-title'>{title}</h5>
                      <p>{content}</p>
                    </div>
                  </div>
                </div>
              )}
            </Draggable>
          )
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>


    <button className='btn btn-primary mt-3' onClick={handleReset}>
      Reset Tiles
    </button>
  </div>
);
};

export default MorningBriefing;
