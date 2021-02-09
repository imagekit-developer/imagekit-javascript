import ImageKit from "../src/index.js";
import { Transformation } from '../types/index';

const imageKit = new ImageKit({
    privateKey: 'private_1234',
    publicKey: 'public_1234',
    urlEndpoint: 'https://ik.imagekit.io/your_imagekit_id/',
});

imageKit.url({ path: '/some/path', transformationPosition: 'path' }); // $ExpectType string
imageKit.url({ src: '/some/src', transformationPosition: 'path' }); // $ExpectType string
imageKit.url({ path: '/some/path', src: '/some/src', transformationPosition: 'path' }); // $ExpectError

imageKit.upload({ file: 'data:image/png;base64,', fileName: 'imagekit.png' }, (error, uploadResponse) => {}); // $ExpectType void
imageKit.upload({ file: 'data:image/png;base64,', fileName: 'imagekit.png' }); // $ExpectType Promise<UploadResponse>

const applyTransformations = (transformations: Transformation[]) => transformations;
applyTransformations([
    {
        height: '300',
        width: '200',
    },
]);
