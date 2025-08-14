# Modeline {
#	 vi: foldmethod=marker foldlevel=0 filetype=python
# }

# imports {
from flask import request, redirect, url_for, session
from flask import Flask, send_file, Response
from flask import render_template
from livereload import Server
from datetime import datetime
import signal
import os
import sys
import shutil
import subprocess
from concurrent.futures import ThreadPoolExecutor
from multiprocessing import Process
from urllib.parse import quote # For URL encoding
from urllib.parse import unquote # For URL decoding
import random
import pandas as pd
# }

# App initialization{
app = Flask(__name__, static_folder="live-documentation-frontend-bundle/dist/assets", template_folder="live-documentation-frontend-bundle/dist/src/templates")
app.secret_key = "your_secret_key"  # Change this to a secure key
app.jinja_env.auto_reload = True
app.config['TEMPLATES_AUTO_RELOAD'] = True
# }

# Admin credentials{
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "password123"
# }

# Define the server's host and port{
HOST = "0.0.0.0"
PORT = 5000
# }

@app.after_request
def add_header(response):
    response.cache_control.no_store = True
    response.cache_control.no_cache = True
    response.cache_control.must_revalidate = True
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

@app.route("/", methods=["GET", "POST"])
def index():# {
    if request.method == "POST":# {
        #username = request.form["username"]
        password = request.form["password"]

        #if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        if password == ADMIN_PASSWORD:
            session["admin"] = True
            return redirect(url_for("home"))
        else:
            return render_template("index.html", error="Invalid credentials")

    return render_template("index.html")# }}

@app.route("/home")
def home():# {
    if not session.get("admin"):# {
        return redirect(url_for("index"))
    return render_template("home.html") # }}

# This is a template doc (ADD DOCs like this)
@app.route("/template_doc")
def getTemplateDoc():# {
    if not session.get("admin"):# {
        return redirect(url_for("index"))
    return render_template("template_doc.html")# }}

@app.route("/eigen_decomposition")
def getEigenDecompositionDoc():# {
    if not session.get("admin"):# {
        return redirect(url_for("index"))
    eigen_decomposition_codes = []
    return render_template("eigen_decomposition.html", codes=eigen_decomposition_codes)# }}

@app.route("/logout")
def logout():# {
    session.pop("admin", None)# {
    return redirect(url_for("index"))# }}

if __name__ == '__main__':
    assert len(sys.argv) == 2
    ADMIN_PASSWORD = sys.argv[1]
    #app.run(host=HOST, port=PORT, threaded=True, debug=False)
    server = Server(app.wsgi_app)
    server.watch('templates/')
    server.watch('static/')
    server.serve(host=HOST, port=PORT, open_url=True)
