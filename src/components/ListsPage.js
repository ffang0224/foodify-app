// ListsPage.js
import { useState, useEffect} from 'react';
import ListCard from './ListCard';
import sampleListsData from "../sample-data/sampleListsData";

const ListsPage = () => {
  
  // Example data structure - replace with database data

  // const [popularLists] = useState([
  //   { id: 1, image: null, header: null, description: null },
  //   { id: 2, image: null, header: null, description: null },
  //   { id: 3, image: null, header: null, description: null }
  // ]);

  const popularLists = Object.values(sampleListsData);
  
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
              key={list.name}
              image={list.image}
              header={list.name}
              description={list.description}
              listId={list.name} // Pass the list name as the listId
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
              listId={list.id} // Pass the list name as the listId
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ListsPage;
