import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import {
  compose,
  applyMiddleware,
} from "redux";


export function collectMiddlewares() {
  const coreMiddlewares = [thunk];

  if (process.env.NODE_ENV !== 'production') {
    coreMiddlewares.push(createLogger());
  }

  return coreMiddlewares;
}

// Define module enhancers
// Make sure that you follow right module order
export function collectEnhancers() {
  const moduleEnhancers = [];
  return moduleEnhancers;
}

export default compose(
  ...collectEnhancers(),
  applyMiddleware(...collectMiddlewares()),
);

