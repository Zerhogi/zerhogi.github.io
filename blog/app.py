from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_uploads import UploadSet, configure_uploads, IMAGES

import os
import textwrap

app = Flask(__name__)
file_path = os.path.abspath(os.getcwd())+"/blog.db"
photos  = UploadSet('photos', IMAGES)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'+file_path
app.config['UPLOADED_PHOTOS_DEST'] = 'static/photos'
configure_uploads(app, photos)
db = SQLAlchemy(app)


class Blogpost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50))
    image = db.Column(db.String(50))
    author = db.Column(db.String(20))
    date_posted = db.Column(db.DateTime)
    content = db.Column(db.Text)

def make_shorter(filtering_str, filtering_width):
    return textwrap.shorten(filtering_str, width=filtering_width, placeholder="...")
@app.route('/')
def index():
    posts = Blogpost.query.all()    
    return render_template('index.html', posts=posts)

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/post/<int:post_id>')
def post(post_id):
    post = Blogpost.query.filter_by(id=post_id).one()

    date_posted = post.date_posted.strftime('%B %d, %Y')

    return render_template('post.html', post=post, date_posted=date_posted)

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/add')
def add():
    return render_template('add.html')

@app.route('/addpost', methods=['POST'])
def addpost():
    title = request.form['title']    
    name = request.form['name']
    text = request.form['message']
    if request.method == 'POST' and 'image' in request.files:
        filename = photos.save(request.files['image'])
    
    post = Blogpost(title=title, author=name, content = text, image=filename, date_posted=datetime.now())

    db.session.add(post)
    db.session.commit()

    return redirect(url_for('index'))

if __name__ == '__main__:':
    app.run(debug=True)
