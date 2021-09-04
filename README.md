<div align="center">
    <img src="public/logo.svg" width="128">
    <h1>Kainet Music</h1>
    <div>
        <a href="https://travis-ci.com/TheDavidDelta/kainet-music">
            <img src="https://travis-ci.com/TheDavidDelta/kainet-music.svg?branch=main" alt="Travis Build">
        </a>
        <a href="https://kainet.rocks/">
            <img src="https://img.shields.io/github/deployments/TheDavidDelta/kainet-music/Production?label=vercel&logo=vercel&color=f5f5f5" alt="Vercel Status">
        </a>
        <a href="https://dashboard.cypress.io/projects/jyio47/runs">
            <img alt="Cypress Tests" src="https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/jyio47&style=flat&logo=cypress">
        </a>
        <a href="./LICENSE">
            <img src="https://img.shields.io/github/license/TheDavidDelta/kainet-music" alt="License">
        </a>
    </div>
    <br />
    Free and Open Source music streaming service
    <hr />
</div>

## How does it work?

Inspired by projects like [NewPipe](https://github.com/TeamNewPipe/NewPipe), [Nitter](https://github.com/zedeus/nitter), [Invidious](https://github.com/iv-org/invidious), [Bibliogram](https://git.sr.ht/~cadence/bibliogram) or my own [Lingva](https://github.com/TheDavidDelta/lingva-translate), *Kainet* scrapes through YouTube Music and retrieves its information without using any Google-related service, preventing them from tracking.

For this purpose, *Kainet* uses mainly these two libraries:

+ [Kainet Scraper](https://github.com/TheDavidDelta/kainet-scraper), a YouTube Music scraper built and maintained specifically for this project, which obtains all kind of information from this platform.
+ [node-ytdl-core](https://github.com/fent/node-ytdl-core), a YouTube downloader used for retrieving and playing the scraped tracks.

In addition, the project uses the following Open Source resources:

+ [TypeScript](https://www.typescriptlang.org/), the JavaScript superset, as the language.
+ [React](https://reactjs.org/) as the main front-end framework.
+ [NextJS](https://nextjs.org/) as the complementary React framework, that provides Server-Side Rendering, Static Site Generation or serverless API endpoints.
+ [ChakraUI](https://chakra-ui.com/) for the in-component styling.
+ [Jest](https://jestjs.io/), [Testing Library](https://testing-library.com/) & [Cypress](https://www.cypress.io/) for unit, integration & E2E testing.
+ [Inkscape](https://inkscape.org/) for designing both the logo.


## Installation

You can optionally install *Kainet* as a Progressive Web App on your computer or mobile phone. This way, it'll be wrapped by your browser and be shown as another installed application.

When opening the application in [a browser that supports PWAs](https://caniuse.com/web-app-manifest), an install button should be shown in the top bar.


## Custom playlists

Currently, *Kainet* still doesn't support user creation, so you can't create custom music playlists inside the platform.

Despite that, you're able to access any playlist from YouTube or YouTube Music. That way, if you don't mind that much going through Google, you can create your custom playlists on YouTube and use them on *Kainet*.

In order to find the playlist with ease, the best way is using its ID, which can be found in the YouTube URL:

```bash
https://youtube.com/playlist?list=PLjp0AEEJ0-fGi7bkjrGhBLUF9NMraL9cL
```

Once you have it, simply search it in the playlists section. In case it's not found, you can directly use the *Kainet*'s playlists URL by adding `VL` to the ID:

```bash
https://kainet.rocks/playlist/VLPLjp0AEEJ0-fGi7bkjrGhBLUF9NMraL9cL
```


## Deployment

As *Kainet* is a [NextJS](https://nextjs.org/) project you can deploy your own instance anywhere Next is supported.

The only requerement is to set an environment variable called `NEXT_PUBLIC_SITE_DOMAIN` with the domain you're deploying the instance under. This is used for the canonical URL and the meta tags.

The easiest way is to use their creators' own platform, [Vercel](https://vercel.com/), where you can deploy it for free with the following button.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2FTheDavidDelta%2Fkainet-music%2Ftree%2Fmain&env=NEXT_PUBLIC_SITE_DOMAIN&envDescription=Your%20domain)


## Instances

These are the currently known *Kainet* instances. Feel free to make a Pull Request including yours (please remember to add `[skip ci]` to the last commit).

| Domain                                           | Hosting                       | SSL Provider                                                                 |
|:------------------------------------------------:|:-----------------------------:|:----------------------------------------------------------------------------:|
| [kainet.rocks](https://kainet.rocks/) (Official) | [Vercel](https://vercel.com/) | [Let's Encrypt](https://www.ssllabs.com/ssltest/analyze.html?d=kainet.rocks) |
| [kainet.alefvanoon.xyz](https://kainet.alefvanoon.xyz/) | [Vercel](https://vercel.com/) | [Let's Encrypt](https://www.ssllabs.com/ssltest/analyze.html?d=kainet.alefvanoon.xyz) |


## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://thedaviddelta.com/"><img src="https://avatars.githubusercontent.com/u/6679900?v=4?s=100" width="100px;" alt=""/><br /><sub><b>David</b></sub></a><br /><a href="#a11y-TheDavidDelta" title="Accessibility">️️️️♿️</a> <a href="https://github.com/TheDavidDelta/kainet-music/commits?author=TheDavidDelta" title="Code">💻</a> <a href="https://github.com/TheDavidDelta/kainet-music/commits?author=TheDavidDelta" title="Documentation">📖</a> <a href="#design-TheDavidDelta" title="Design">🎨</a> <a href="https://github.com/TheDavidDelta/kainet-music/commits?author=TheDavidDelta" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!


## License

[![](https://www.gnu.org/graphics/agplv3-with-text-162x68.png)](https://www.gnu.org/licenses/agpl-3.0.html)

Copyright © 2021 [TheDavidDelta](https://github.com/TheDavidDelta) & contributors.  
This project is [GNU AGPLv3](./LICENSE) licensed.
