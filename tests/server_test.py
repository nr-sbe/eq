import importlib.util,unittest
from pathlib import Path
path=Path(__file__).resolve().parent.parent/'serve.py'
spec=importlib.util.spec_from_file_location('fivefold_server',path);server=importlib.util.module_from_spec(spec);spec.loader.exec_module(server)
class StaticServerTests(unittest.TestCase):
    def test_entry_and_audio(self):
        for url in ['/','/Fivefold-3D.html','/game.js','/assets/audio/old-ones.ogg','/assets/effects/lightning-impact.wav','/assets/effects/lightning-impact.wav']:
            self.assertIsNotNone(server.resolve_asset(url),url)
    def test_workspace_and_traversal_are_denied(self):
        for url in ['/../work/secret.txt','/%2e%2e/secret.txt','/.git/config','/tests/server_test.py','/serve.py','/assets/','/C:/Windows/win.ini','/%5c..%5csecret.txt','/.env','/missing.mp3']:
            self.assertIsNone(server.resolve_asset(url),url)
if __name__=='__main__':unittest.main()
