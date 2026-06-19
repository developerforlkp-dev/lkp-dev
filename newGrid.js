export function BlogGrid({ posts = [] }) {
  if (!posts || posts.length === 0) {
    return (
      <section className="w-full max-w-7xl mx-auto px-6 py-12 text-center">
        <p className="text-gray-500">No posts found.</p>
      </section>
    );
  }

  // Create columns to stagger the cards like the original design
  const col1 = [];
  const col2 = [];
  const col3 = [];
  
  posts.forEach((post, i) => {
    if (i % 3 === 0) col1.push(post);
    else if (i % 3 === 1) col2.push(post);
    else col3.push(post);
  });

  const getImageClass = (index, colIndex) => {
    if (colIndex === 0) return index % 2 === 0 ? 'h-[340px] rounded-t-[100px] rounded-b-3xl' : 'h-48 rounded-3xl rounded-bl-[60px]';
    if (colIndex === 1) return index % 2 === 0 ? 'h-56 rounded-[40px]' : 'h-60 rounded-[40px]';
    return 'h-64 rounded-3xl';
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 items-start">
        {/* Column 1 */}
        <div className="flex flex-col gap-16">
          {col1.map((post, idx) => (
            <BlogCard key={post.id} {...post} imageClassName={getImageClass(idx, 0)} badgeIcon={badgeIcons[post.id] || null} />
          ))}
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-16">
          {col2.length > 0 && <BlogCard key={col2[0].id} {...col2[0]} imageClassName={getImageClass(0, 1)} badgeIcon={badgeIcons[col2[0].id] || null} />}
          
          {/* Quote Block */}
          <div className="relative py-16 px-10 flex items-center justify-center text-center my-6">
            <div className="absolute inset-0 bg-cyan-50 opacity-90 -z-10 transform scale-105" 
                 style={{ borderRadius: '120px 40px 120px 40px' }}></div>
            <Quote size={50} fill="currentColor" className="absolute top-6 left-8 text-cyan-200 opacity-60" />
            <Quote size={50} fill="currentColor" className="absolute bottom-6 right-8 text-cyan-200 opacity-60 transform rotate-180" />
            
            <h3 className="text-xl md:text-[28px] font-bold text-[var(--color-brand-dark)] leading-snug">
              The world is full of <br />
              beautiful places — <br />
              let's go <span className="text-[var(--color-brand)] italic">explore</span> them.
            </h3>
          </div>

          {col2.slice(1).map((post, idx) => (
            <BlogCard key={post.id} {...post} imageClassName={getImageClass(idx + 1, 1)} badgeIcon={badgeIcons[post.id] || null} />
          ))}
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-16 mt-0 lg:mt-8">
          {col3.map((post, idx) => (
            <BlogCard key={post.id} {...post} imageClassName={getImageClass(idx, 2)} badgeIcon={badgeIcons[post.id] || null} />
          ))}
        </div>
      </div>
    </section>
  );
}

