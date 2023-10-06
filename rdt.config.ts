interface DevToolsServerConfig {
   wsPort?: number;
   withWebsocket?: boolean;
   silent?: boolean;
   logs?: {
      cookies?: boolean;
      defer?: boolean;
      actions?: boolean;
      loaders?: boolean;
      cache?: boolean;
      siteClear?: boolean;
   };
}

export const rdtServerConfig: DevToolsServerConfig = {
   // Sets the ws port for the dev tools to communicate with the client dev tools
   // wsPort: 8080,
   // allows you to not communicate at all with the client dev tools
   //  withWebsocket: boolean;
   // allows you to not log anything to the console
   //  silent: boolean;
   logs: {
      // allows you to not log cookie logs to the console
      cookies: true,
      // allows you to not log defer logs to the console
      defer: true,
      // allows you to not log action logs to the console
      actions: true,
      // allows you to not log loader logs to the console
      loaders: true,
      // allows you to not log cache logs to the console
      cache: true,
      // allows you to not log when cache is cleared to the console
      siteClear: true,
   },
};

interface RemixDevToolsProps {
   // Whether the dev tools require a url flag to be shown
   requireUrlFlag?: boolean;
   // Additional tabs to add to the dev tools
   plugins?: Array<any>;
   // The port to use for the dev tools websocket that communicates with the backend dev tools
   wsPort?: number;
}

export const rdtClientConfig: RemixDevToolsProps = {
   //Requires rdt=true to be present in the URL search to open the Remix Development Tools. Defaults to false.
   // requireUrlFlag: false,
   // Allows you to provide additional tabs (plugins) to the Remix Development Tools. Defaults to [].
   // plugins: [],
   // wsPort: Allows you to specify over which port the client dev tools will communicate with the server dev tools. Defaults to 8080.
   // wsPort: 8080,
};
