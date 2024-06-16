from flask import Flask, request
import json, base64
from diffusers import StableDiffusionPipeline
import torch
from io import BytesIO

# Diffusion 모델 불러오기
model_id = "runwayml/stable-diffusion-v1-5"
pipe = StableDiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float16)
pipe = pipe.to("cuda")

# 프로그램 실행시 아래 명령어로 실행. 포트번호는 변경 가능
# flask run --host='0.0.0.0' --port='21221'
app = Flask(__name__)

@app.route("/gen_image", methods=["POST"])
def gen_image():
    if request.method == 'POST':
        # json 형식으로 요청해야한다.
        print("request 받음")
        json_data = request.get_json()
        dict_data = json.loads(json.dumps(json_data))
        for key, value in dict_data.items():
            if type(value) is str:
                print(f"{key}: {value[:20]}")
            else:
                print(f"{key}: {value}")
        '''
        ==========================================
                        json info
        ==========================================
        prompt  : 생성할 이미지 요구조건
        '''
        prompt = dict_data['prompt']
        image = pipe(prompt).images[0]
        
        # 이미지를 byte stream으로 변환
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
        
        file = {"img": img_str}
        return file

# 테스트용 코드        
# if __name__=="__main__":
#     model_id = "runwayml/stable-diffusion-v1-5"
#     pipe = StableDiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float16)
#     pipe = pipe.to("cuda")
#     # 실행
#     app.run(host='0.0.0.0', port=21221, debug=True)