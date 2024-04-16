def code_to_module(code,module_name):
    import os, sys
    os.mkdir(sys.path[-1].replace('\\','/')+'/'+module_name)
    with open(sys.path[-1].replace('\\','/')+'/'+module_name+'/__init__.py','w') as f:
        f.write(code)

