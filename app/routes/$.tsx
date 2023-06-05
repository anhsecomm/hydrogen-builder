import {type LoaderArgs} from '@shopify/remix-oxygen';
import {BuilderComponent, builder} from '@builder.io/react';
import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';

builder.init('f877e1b2df4c485599551d2472e1ab74');

export async function loader({params, context, request}: LoaderArgs) {
  // @ts-ignore
  const url = params['*'].split('/');
  const {language, country} = context.storefront.i18n;

  if (
    url[0] &&
    url[0].toLowerCase() == `${language}-${country}`.toLowerCase()
  ) {
    const page = await builder
      .get('page', {
        userAttributes: {
          urlPath: `/${url[1]}`,
          locale: `${url[0]}`,
        },
        options: {
          locale: url[0],
        },
      })
      .toPromise();
    const isPreviewing = new URL(request.url).searchParams.has(
      'builder.preview',
    );
    if (!page && !isPreviewing) {
      throw new Response('Not found', {status: 404});
    }
    return json({page, locale: url[0]});
  }
}

export default function Component() {
  const {page, locale} = useLoaderData<typeof loader>();
  if (page) {
    return <BuilderComponent model="page" content={page} locale={locale} />;
  }
  return null;
}
