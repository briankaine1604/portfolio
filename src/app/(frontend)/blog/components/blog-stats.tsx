export const BlogStats = ({ length }: { length: number }) => {
  return (
    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-lime-400 border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 text-center relative">
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-black"></div>
        <div className="text-3xl font-black">{length}</div>
        <div className="font-mono text-xs uppercase tracking-wide">
          POSTS PUBLISHED
        </div>
      </div>

      <div className="bg-black text-white border-4 border-black shadow-[8px_8px_0px_0px_#666] p-6 text-center relative">
        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-lime-400 border-2 border-black"></div>
        <div className="text-3xl font-black">4</div>
        <div className="font-mono text-xs uppercase tracking-wide">
          CATEGORIES
        </div>
      </div>

      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 text-center">
        <div className="text-3xl font-black">∞</div>
        <div className="font-mono text-xs uppercase tracking-wide">
          BUGS CREATED WHILE WRITING
        </div>
      </div>
    </div>
  );
};
