import json
import time
from deep_translator import GoogleTranslator

with open('en_dict_clean.json', 'r', encoding='utf-8') as f:
    en_dict = json.load(f)

ja_dict = {}
translator = GoogleTranslator(source='en', target='ja')

keys = list(en_dict.keys())
print(f"Total keys: {len(keys)}")
for i, k in enumerate(keys):
    v = en_dict[k]
    if not isinstance(v, str):
        ja_dict[k] = v
        continue
        
    try:
        # replace placeholders so they don't get translated
        temp_v = v.replace('{wallet}', 'WALLET_REPLACE')
        temp_v = temp_v.replace('{name}', 'NAME_REPLACE')
        temp_v = temp_v.replace('{level}', 'LEVEL_REPLACE')
        temp_v = temp_v.replace('{quota}', 'QUOTA_REPLACE')
        temp_v = temp_v.replace('{product}', 'PRODUCT_REPLACE')
        
        translated = translator.translate(temp_v)
        
        # put placeholders back
        translated = translated.replace('WALLET_REPLACE', '{wallet}')
        translated = translated.replace('NAME_REPLACE', '{name}')
        translated = translated.replace('LEVEL_REPLACE', '{level}')
        translated = translated.replace('QUOTA_REPLACE', '{quota}')
        translated = translated.replace('PRODUCT_REPLACE', '{product}')
        
        ja_dict[k] = translated
    except Exception as e:
        print(f"Error on {k}: {e}")
        ja_dict[k] = v
        
    time.sleep(0.1) # prevent blocking
    if i % 20 == 0:
        print(f"Translated {i} items")

with open('ja_dict.json', 'w', encoding='utf-8') as f:
    json.dump(ja_dict, f, ensure_ascii=False, indent=4)

ja_js_content = ",\n  ja: " + json.dumps(ja_dict, ensure_ascii=False, indent=4) + "\n"

with open('src/locales/translations.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

last_brace_index = js_content.rfind('}')
if last_brace_index != -1:
    new_js_content = js_content[:last_brace_index] + ja_js_content + js_content[last_brace_index:]
    with open('src/locales/translations.js', 'w', encoding='utf-8') as f:
        f.write(new_js_content)
    print("Successfully injected ja into translations.js")
else:
    print("Could not find closing brace")
