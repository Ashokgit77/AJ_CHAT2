from flask import Flask, render_template, request, jsonify
import os
import re
import markdown2
import google.generativeai as genai 
from dotenv import load_dotenv


load_dotenv()

API_KEY = os.getenv('GEMINI_API_KEY')

genai.configure(
  api_key=API_KEY
)

app = Flask(__name__)

def convert_markdown(text):
    html = markdown2.markdown(text)
    return html

def strip_html_tags(html_text):
    clean_text = re.sub('<[^<]+?>', '', html_text)
    return clean_text


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send-message', methods=['POST'])
def send_message():
    user_input = request.json['message']
    model = genai.GenerativeModel('gemini-pro')
    chat = model.start_chat(history=[])
    response = chat.send_message(user_input)
    formatted_html = convert_markdown(response.text)
    clean_text = strip_html_tags(formatted_html)
    response_text_with_line_breaks = clean_text.replace('\n','\n')

    return jsonify({'message': response_text_with_line_breaks})

if __name__ == '__main__':
    app.run(debug=True)
