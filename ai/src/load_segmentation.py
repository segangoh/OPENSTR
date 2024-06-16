from argparse import ArgumentParser
import sys, os, gc, torch
import mmcv
from mmseg.apis import inference_segmentor, init_segmentor, show_result_pyplot
from mmseg.core.evaluation import get_palette
from mmcv.runner import load_checkpoint
from mmseg.core import get_classes
import cv2
import os.path as osp
from PIL import Image
import numpy as np
parent_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
import_path = parent_path + "/ViT-Adapter/segmentation"
sys.path.append(import_path)
import mmcv_custom   # noqa: F401,F403
import mmseg_custom   # noqa: F401,F403

class Segmenter:
    def __init__(self):
        self.parser = ArgumentParser()
        self.parse_args()
        self.config = import_path + "/configs/ade20k/upernet_augreg_adapter_base_512_160k_ade20k.py"
        self.checkpoint = parent_path + "/released/upernet_augreg_adapter_base_512_160k_ade20k.pth.tar"
        self.img = ""
        self.args = self.parser.parse_args([self.config, 
                                            self.checkpoint, 
                                            self.img,
                                            "--palette", "ade20k"])
        self.load_model()
        
    def parse_args(self):
        self.parser.add_argument('config', help='Config file')
        self.parser.add_argument('checkpoint', help='Checkpoint file')
        self.parser.add_argument('img', help='Image file')
        self.parser.add_argument('--out', type=str, default="data/content", help='out dir')
        self.parser.add_argument(
            '--device', default='cuda:0', help='Device used for inference')
        self.parser.add_argument(
            '--palette',
            default='cityscapes',
            help='Color palette used for segmentation map')
        self.parser.add_argument(
            '--opacity',
            type=float,
            default=0.5,
            help='Opacity of painted segmentation map. In (0, 1] range.')

    def load_model(self):
        self.model = init_segmentor(self.args.config, checkpoint=None, device='cuda:0')
        checkpoint = load_checkpoint(self.model, self.args.checkpoint, map_location='cpu')
        if 'CLASSES' in checkpoint.get('meta', {}):
            self.model.CLASSES = checkpoint['meta']['CLASSES']
        else:
            self.model.CLASSES = get_classes(self.args.palette)
    
    def run(self, img_name:str)->np:
        self.args.img = f"{parent_path}/data/content/{img_name}"
        
        result = inference_segmentor(self.model, self.args.img)
        mask = (result[0] == 12).astype(np.uint8) #* 255
        mask = np.stack([mask, mask, mask], 2)
        del result
        gc.collect()
        torch.cuda.empty_cache()
        return mask

if __name__ == "__main__":
    segmenter = Segmenter()