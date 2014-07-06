import json
import webapp2
from google.appengine.ext import ndb
from google.appengine.api import users


class Phrase(ndb.Model):
    japanese = ndb.TextProperty()
    english = ndb.TextProperty()
    user = ndb.StringProperty()
    created_at = ndb.DateTimeProperty(auto_now_add=True)
    updated_at = ndb.DateTimeProperty(auto_now=True)

    def to_dict(self):
        return {
            'japanese': self.japanese,
            'english': self.english,
            'createdAt': self.created_at.strftime("%Y-%m-%dT%H:%M:%SZ"),
            'updatedAt': self.updated_at.strftime("%Y-%m-%dT%H:%M:%SZ"),
        }


class PhraseHandler(webapp2.RequestHandler):
    def get(self):
        phrases = [phrase.to_dict() for phrase in Phrase.query()]
        self.response.write(json.dumps(phrases))

    def post(self):
        current_user = users.get_current_user()
        data = json.loads(self.request.body)
        phrase = Phrase(
            japanese=data['japanese'],
            english=data['english'],
            user=current_user.user_id())
        phrase.put()
        self.response.write(json.dumps(phrase.to_dict()))


class LoginHandler(webapp2.RequestHandler):
    def get(self):
        self.redirect(users.create_login_url('/'))


class LogoutHandler(webapp2.RequestHandler):
    def get(self):
        self.redirect(users.create_logout_url('/'))


class UserHandler(webapp2.RequestHandler):
    def get(self):
        current_user = users.get_current_user()
        user = {}
        if current_user:
            user['id'] = current_user.user_id()
            user['email'] = current_user.email()
        self.response.write(json.dumps(user))


app = webapp2.WSGIApplication([
    ('/api/auth/login', LoginHandler),
    ('/api/auth/logout', LogoutHandler),
    ('/api/auth/user', UserHandler),
    ('/api/phrases', PhraseHandler)
], debug=True)
