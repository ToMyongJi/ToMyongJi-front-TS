import loading from '@assets/icons/loading.svg';

const Loading = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <img src={loading} alt="loading" className="h-[16.3rem] w-[12.8rem]" />
    </div>
  );
};

export default Loading;
