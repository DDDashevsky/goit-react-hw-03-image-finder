import React from 'react';
import SearchBar from './Searchbar';
import fetchAPI from './API';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ImageGallery } from './ImageGallery';
import { Modal } from './Modal';
import { Loader } from './Loader';
import { LoadMore } from './LoadMore';

export default class App extends React.Component {
  state = {
    query: '',
    page: 1,
    images: [],
    totalHits: null,
    status: 'idle',
    error: null,
    modalImage: null,
    alt: null,
  };

  async componentDidUpdate(prevProps, prevState) {
    const { page, query } = this.state;

    if (prevState.query !== query || prevState.page !== page) {
      this.setState({ status: 'pending' });

      try {
        const imageData = await fetchAPI(query, page);
        this.setState({ totalHits: imageData.totalHits });
        const imagesHits = imageData.hits;
        if (imagesHits.length === 0) {
          toast.warning('No results');
        }

        this.setState(({ images }) => ({
          images: [...images, ...imagesHits],
          status: 'resolved',
        }));
      } catch (error) {
        toast.error(`There's an error: ${error.message}`);
        this.setState({ status: 'rejected' });
      } finally {
        if (page * 12 > this.state.totalHits && page !== 1) {
          toast.warning('Thats all');
        }
      }
    }
  }

  onSubmit = query => {
    if (this.state.query === query) {
      return;
    }
    this.resetState();
    this.setState({ query });
  };

  incrementPage = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  onSelectedImg = (largeImageUrl, tags) => {
    this.setState({
      modalImage: largeImageUrl,
      alt: tags,
    });
  };

  closeModal = () => {
    this.setState({ modalImage: null });
  };

  resetState = () => {
    this.setState({
      query: '',
      page: 1,
      images: [],
      modalImage: null,
      alt: null,
      status: 'idle',
    });
  };

  render() {
    const { images, status, modalImage, alt } = this.state;

    return (
      <>
        <SearchBar onSubmit={this.onSubmit} />

        {images.length > 0 && (
          <ImageGallery images={images} modalImage={this.onSelectedImg} />
        )}

        {images.length > 0 && images.length !== this.totalHits && (
          <LoadMore onClick={this.incrementPage} />
        )}

        {modalImage !== null && (
          <Modal modalImage={modalImage} tags={alt} onClose={this.closeModal} />
        )}

        {status === 'pending' && <Loader />}
        <ToastContainer />
      </>
    );
  }
}
