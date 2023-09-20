import { useLoaderData } from "react-router-dom";

const YourTopSongs = () => {
  const topItems = useLoaderData();
  console.log(topItems);

  return (
    <>
      <h1>{topItems.href}</h1>
    </>
  );
};

export default YourTopSongs;
