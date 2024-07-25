declare module '*.svg' {
  const content: string;
  export default content;
}

declare module 'spel2js';

declare module 'react-tabs-scrollable';

declare module '*.graphql' {
  import { DocumentNode } from 'graphql';

  const value: DocumentNode;
  export = value;
}

declare module 'tinymce';

declare module 'eventsourcemock';
