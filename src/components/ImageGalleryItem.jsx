import PropTypes from 'prop-types';

export const ImageGalleryItem = ({ tags, preview, modalImage }) => {
  return (
    <li className="ImageGalleryItem">
      <img
        className="ImageGalleryItem-image"
        src={preview}
        alt={tags}
        onClick={modalImage}
      />
    </li>
  );
};

ImageGalleryItem.propTypes = {
  tags: PropTypes.string.isRequired,
  preview: PropTypes.string.isRequired,
  modalImage: PropTypes.func,
};
