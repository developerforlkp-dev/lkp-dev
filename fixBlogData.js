const fs = require('fs'); let data = fs.readFileSync('d:/lkpui/lkp-dev/src/utils/blogData.js', 'utf8'); data = data.replace(/export function mapApiBlogToComponentFormat[\s\S]*$/, \export function mapApiBlogToComponentFormat(apiBlog) {
  if (!apiBlog) return null;
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const calculateReadTime = (text) => {
    if (!text) return '3 min read';
    const words = text.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
    const mins = Math.max(1, Math.ceil(words / 200));
    return \\\\\\ min read\\\;
  };

  const defaultImage = '/images/blog/landscape-fallback.webp';
  const imageUrl = apiBlog.coverImageUrl || defaultImage;

  return {
    id: apiBlog.blogPostId || Math.random(),
    slug: apiBlog.slug,
    image: imageUrl,
    heroImage: imageUrl,
    galleryImages: [imageUrl, imageUrl, imageUrl],
    category: (apiBlog.tags && apiBlog.tags.length > 0) ? apiBlog.tags[0] : 'Blog',
    title: apiBlog.title || 'Untitled',
    description: apiBlog.summary || '',
    date: formatDate(apiBlog.publishedAt || apiBlog.createdAt),
    readTime: calculateReadTime(apiBlog.content),
    imageClassName: 'h-[340px] rounded-t-[100px] rounded-b-3xl',
    author: apiBlog.authorName || (apiBlog.authorFirstName ? \\\\\\ \\\\\\.trim() : 'Unknown Author'),
    authorImage: defaultImage,
    authorBio: '',
    content: {
      intro: apiBlog.summary || '',
      sections: [
        {
          heading: '',
          body: apiBlog.content || '',
          image: null,
        }
      ],
      conclusion: '',
    },
    tags: apiBlog.tags || [],
    relatedIds: [],
  };
}\); fs.writeFileSync('d:/lkpui/lkp-dev/src/utils/blogData.js', data);
