from flask import Flask, render_template, jsonify, url_for
import psutil
import os

app = Flask(__name__, 
    static_url_path='',
    static_folder='static',
    template_folder='templates')

def get_windows_services():
    services = []
    for service in psutil.win_service_iter():
        info = service.as_dict()
        services.append({
            'name': info['name'],
            'display_name': info['display_name'],
            'status': info['status'],
            'start_type': info['start_type']
        })
    return services

@app.route('/')
def index():
    services = get_windows_services()
    return render_template('index.html', services=services)

@app.route('/api/services')
def get_services():
    services = get_windows_services()
    return jsonify(services)

if __name__ == '__main__':
    app.run(debug=True)
