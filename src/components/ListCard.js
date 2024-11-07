import { useNavigate } from 'react-router-dom';
// Disclaimer: This component has been partially generated using Claude.
const ListCard = ({ image, header, description, listId }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/restaurants`);
  };

  return (
    <div
      className="w-64 h-80 border-2 border-gray-300 rounded-lg p-4 m-2 flex flex-col items-center cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="w-full h-40 bg-gray-200 mb-4">
        {image ? (
          <img
            src={image}
            alt={header}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            &lt;img&gt;
          </div>
        )}
      </div>
      <div className="w-full text-center">
        {header ? (
          <h3
            className="text-lg font-semibold mb-2 text-gray-900 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
            onClick={handleCardClick}
          >
            {header}
          </h3>
        ) : (
          <div className="text-gray-500">&lt;header&gt;</div>
        )}
        {description ? (
          <p className="text-sm text-gray-600">{description}</p>
        ) : (
          <div className="text-gray-500">&lt;p&gt;</div>
        )}
      </div>
    </div>
  );
};

export default ListCard;