import { posterDatas } from './demoData';
import { createPoster } from './index';

createPoster(posterDatas[1]).then(image => {
    image.toFile('./test.png');
})