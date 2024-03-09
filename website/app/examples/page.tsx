import { Link } from '~/components/Link';
import { PageContainer } from '~/components/PageContainer';
import type { Metadata } from 'next';

interface Example {
  name: string;
  url: string;
}

export const metadata: Metadata = {
  title: 'OverlayScrollbars Examples',
};

const renderExample = (logo: string, framework: string, examples: Example[]) => {
  return (
    <div className="flex-1 whitespace-nowrap border border-slate-200 px-3 py-5 rounded-lg shadow-lg shadow-slate-300/25 bg-white">
      <div className="relative w-16 h-16 mx-auto mb-6">
        <div
          style={{ backgroundImage: `url(${logo})` }}
          className="bg-contain bg-center bg-no-repeat w-full h-full [filter:blur(20px)] opacity-30"
        />
        <img
          src={logo}
          alt={framework}
          className="absolute top-0 left-0 w-full h-full object-contain"
        />
      </div>
      <h2 className="font-semiBold text-base text-center">{framework} Examples</h2>
      <ul className="list-disc list-inside px-3 mt-6 space-y-2">
        {examples.map(({ name, url }) => (
          <li key={`${name}${url}`}>
            <Link href={url} external>
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ExamplesPage = () => {
  return (
    <PageContainer className="h-full">
      <main className="h-full grid items-center justify-items-center py-5 grid-rows-[auto_1fr]">
        <Link href="/" className="p-4">
          Documentation
        </Link>
        <div className="w-full grid gap-6 grid-cols-fit-56 py-6">
          {renderExample('/OverlayScrollbars/icon/javascript.svg', 'JavaScript', [
            { name: 'Demo App', url: '/OverlayScrollbars/example/overlayscrollbars' },
            { name: 'StackBlitz', url: 'https://stackblitz.com/edit/overlayscrollbars' },
            {
              name: 'CodeSandbox',
              url: 'https://codesandbox.io/p/sandbox/overlayscrollbars-example-29hk3v',
            },
          ])}
          {renderExample(
            'https://raw.githubusercontent.com/KingSora/OverlayScrollbars/master/packages/overlayscrollbars-react/logo.svg',
            'React',
            [
              { name: 'Demo App', url: '/OverlayScrollbars/example/react' },
              { name: 'StackBlitz', url: 'https://stackblitz.com/edit/overlayscrollbars-react' },
              {
                name: 'CodeSandbox',
                url: 'https://codesandbox.io/p/sandbox/overlayscrollbars-react-example-ddz458',
              },
            ]
          )}
          {renderExample(
            'https://raw.githubusercontent.com/KingSora/OverlayScrollbars/master/packages/overlayscrollbars-vue/logo.svg',
            'Vue',
            [
              { name: 'Demo App', url: '/OverlayScrollbars/example/vue' },
              { name: 'StackBlitz', url: 'https://stackblitz.com/edit/overlayscrollbars-vue' },
              {
                name: 'CodeSandbox',
                url: 'https://codesandbox.io/p/sandbox/overlayscrollbars-vue-example-rh3vjm',
              },
            ]
          )}
          {renderExample(
            'https://raw.githubusercontent.com/KingSora/OverlayScrollbars/master/packages/overlayscrollbars-ngx/logo.svg',
            'Angular',
            [
              { name: 'Demo App', url: '/OverlayScrollbars/example/angular' },
              { name: 'StackBlitz', url: 'https://stackblitz.com/edit/overlayscrollbars-ngx' },
              {
                name: 'CodeSandbox',
                url: 'https://codesandbox.io/p/sandbox/overlayscrollbars-ngx-example-dwtg9q',
              },
            ]
          )}
          {renderExample(
            'https://raw.githubusercontent.com/KingSora/OverlayScrollbars/master/packages/overlayscrollbars-solid/logo.svg',
            'Solid',
            [
              { name: 'Demo App', url: '/OverlayScrollbars/example/solid' },
              { name: 'StackBlitz', url: 'https://stackblitz.com/edit/overlayscrollbars-solid' },
              {
                name: 'CodeSandbox',
                url: 'https://codesandbox.io/p/sandbox/overlayscrollbars-solid-example-wxl45n',
              },
            ]
          )}
          {renderExample(
            'https://raw.githubusercontent.com/KingSora/OverlayScrollbars/master/packages/overlayscrollbars-svelte/logo.svg',
            'Svelte',
            [
              { name: 'Demo App', url: '/OverlayScrollbars/example/svelte' },
              { name: 'StackBlitz', url: 'https://stackblitz.com/edit/overlayscrollbars-svelte' },
              {
                name: 'CodeSandbox',
                url: 'https://codesandbox.io/p/sandbox/overlayscrollbars-svelte-example-8gqhrp',
              },
            ]
          )}
        </div>
      </main>
    </PageContainer>
  );
};

export default ExamplesPage;
