// app/share/[id]/page.tsx
import { Metadata } from 'next';
import Image from 'next/image';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}, parent: any): Promise<Metadata> => {
  const { id } = await params;
  // Використовуємо той самий URL що і в компоненті
  const imageUrl = `https://storage.googleapis.com/dev-alh-app-dev-001-public-assets/shared-streak/${id}`;
  
  // Спробуємо отримати URL з headers або використаємо фіксований
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://weather-test-iwqjw769f-antonbaranskyis-projects.vercel.app';

  // eslint-disable-next-line no-console
  console.log('Metadata - imageUrl:', imageUrl);
  // eslint-disable-next-line no-console
  console.log('Metadata - baseUrl:', baseUrl);

  return {
    title: "I'm learning African languages! Join me!",
    description:
      'Check out my learning progress and join me in learning African languages!',
    openGraph: {
      title: "I'm learning African languages! Join me!",
      description:
        'Check out my learning progress and join me in learning African languages!',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'Learning progress screenshot',
          type: 'image/png',
        },
      ],
      url: `${baseUrl}/share/${id}`,
      type: 'website',
      siteName: 'African Language House',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: "I'm learning African languages! Join me!",
      description:
        'Check out my learning progress and join me in learning African languages!',
      images: [imageUrl],
      creator: '@your_twitter_handle',
    },
    // Додаткові мета теги для кращої сумісності
    other: {
      'fb:app_id': process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
      'og:image:secure_url': imageUrl,
      'og:image:type': 'image/png',
      'og:image:width': '1200',
      'og:image:height': '630',
    },
  };
};

export default async function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // params.id вже містить повний fileKey (наприклад: shared-streak/filename)
  const imageUrl = `https://storage.googleapis.com/dev-alh-app-dev-001-public-assets/shared-streak/${id}`;

  // eslint-disable-next-line no-console
  console.log('SharePage - params.id:', id);
  // eslint-disable-next-line no-console
  console.log('SharePage - imageUrl:', imageUrl);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
      <Image
        src={imageUrl}
        alt="Shared photo"
        width={1200}
        height={630}
        style={{ maxWidth: '100%', borderRadius: '12px' }}
      />
    </div>
  );
}