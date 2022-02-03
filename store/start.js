import {init} from '@rematch/core';
import news from './news';

const models = {
  news,
};
const store = init({
  models,
});
export default store