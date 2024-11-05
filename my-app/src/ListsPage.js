// ListsPage.js
import { useState, useEffect} from 'react';
//import Papa from 'papaparse';
import ListCard from './ListCard';

const ListsPage = () => {
  console.log("List page entered")
  // Example data structure - replace with database data

  const [popularLists] = useState([
    { id: 1, image: null, header: null, description: null },
    { id: 2, image: null, header: null, description: null },
    { id: 3, image: null, header: null, description: null }
  ]);
  
  const [userLists] = useState([
    { id: 1, image: null, header: null, description: null },
    { id: 2, image: null, header: null, description: null },
    { id: 3, image: null, header: null, description: null },
    { id: 4, image: null, header: null, description: null }
  ]);

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Popular Lists Section */}
      <section className="mb-12">
        <h2 className="text-xl text-gray-700 mb-4">Popular Lists</h2>
        <div className="flex flex-wrap justify-start gap-4">
          {popularLists.map(list => (
            <ListCard
              key={list.id}
              image={list.image}
              header={list.header}
              description={list.description}
            />
          ))}
        </div>
      </section>

      {/* Your Lists Section */}
      <section>
        <h2 className="text-xl text-gray-700 mb-4">Your Lists</h2>
        <div className="flex flex-wrap justify-start gap-4">
          {userLists.map(list => (
            <ListCard
              key={list.id}
              image={list.image}
              header={list.header}
              description={list.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ListsPage;

  //const [popularLists, setPopularLists] = useState([]);
  // useEffect(() => {
  //   const fetchPopularLists = async () => {
  //     const csvFilePath = './TestingDataPlaylists.csv';

  //     const response = await fetch(csvFilePath);
  //     const csvData = await response.text();
  //     console.log(csvData);

  //     Papa.parse(csvData, {
  //       download: true,
  //       header: true,
  //       skipEmptyLines: true,
  //       complete: (results) => {
  //         const lists = results.data.map((row, index) => ({
  //           id: index + 1,
  //           image: null,
  //           header: row.name,
  //           description: row.description
  //         }));

  //         setPopularLists(lists);
  //       }
  //     });
  //   };
  //   fetchPopularLists();
  // }, []);
