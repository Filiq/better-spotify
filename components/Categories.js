import Category from "./Category";

export default function Categories({ categories }) {
  return (
    <div className="flex flex-wrap px-8 pb-32 -ml-2 text-white">
      {categories?.map((category, idx) => (
        <Category key={idx} category={category} />
      ))}
    </div>
  );
}
