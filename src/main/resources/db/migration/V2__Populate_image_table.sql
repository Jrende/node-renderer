INSERT INTO images (source, user_id) VALUES (
    '[{"type":{"id":3,"name":"Solid Color","values":{"color":{"name":"Color","type":"color"}},"output":{"out":{"type":"FrameBuffer","name":"Output"}}},"pos":[-274.390625,94.63348388671875],"id":3,"input":{},"values":{"color":{"r":255,"g":0,"b":0,"a":1}}},{"type":{"id":1,"name":"Clouds","values":{"seed":{"name":"Seed","type":"number","default":1},"size":{"name":"Size","type":"number","default":1},"density":{"name":"Density","type":"number","min":0,"max":1,"default":0.5}},"output":{"out":{"type":"FrameBuffer","name":"Output"}}},"pos":[-242.14825439453125,-3.725799560546875],"id":1,"input":{},"values":{"seed":1,"size":"12","density":0.5}},{"type":{"id":2,"name":"Blend","values":{"mode":{"name":"Mode","type":"enum","values":["Normal","Screen","Multiply"],"default":"Normal"},"factor":{"name":"Factor","type":"number","default":0.5,"max":1,"min":0}},"input":{"left":{"type":"FrameBuffer","name":"Left"},"right":{"type":"FrameBuffer","name":"Right"}},"output":{"out":{"type":"FrameBuffer","name":"Output"}}},"pos":[-101.67059326171875,22.02740478515625],"id":2,"input":{"left":{"id":1,"name":"out","node":{"type":{"id":1,"name":"Clouds","values":{"seed":{"name":"Seed","type":"number","default":1},"size":{"name":"Size","type":"number","default":1},"density":{"name":"Density","type":"number","min":0,"max":1,"default":0.5}},"output":{"out":{"type":"FrameBuffer","name":"Output"}}},"pos":[-242.14825439453125,-3.725799560546875],"id":1,"input":{},"values":{"seed":1,"size":"12","density":0.5}}},"right":{"id":3,"name":"out","node":{"type":{"id":3,"name":"Solid Color","values":{"color":{"name":"Color","type":"color"}},"output":{"out":{"type":"FrameBuffer","name":"Output"}}},"pos":[-274.390625,94.63348388671875],"id":3,"input":{},"values":{"color":{"r":255,"g":0,"b":0,"a":1}}}}},"values":{"mode":"Multiply","factor":"1"}},{"id":0,"pos":[77.39068603515625,7.209625244140625],"input":{"finalResult":{"id":2,"name":"out","node":{"type":{"id":2,"name":"Blend","values":{"mode":{"name":"Mode","type":"enum","values":["Normal","Screen","Multiply"],"default":"Normal"},"factor":{"name":"Factor","type":"number","default":0.5,"max":1,"min":0}},"input":{"left":{"type":"FrameBuffer","name":"Left"},"right":{"type":"FrameBuffer","name":"Right"}},"output":{"out":{"type":"FrameBuffer","name":"Output"}}},"pos":[-101.67059326171875,22.02740478515625],"id":2,"input":{"left":{"id":1,"name":"out","node":{"type":{"id":1,"name":"Clouds","values":{"seed":{"name":"Seed","type":"number","default":1},"size":{"name":"Size","type":"number","default":1},"density":{"name":"Density","type":"number","min":0,"max":1,"default":0.5}},"output":{"out":{"type":"FrameBuffer","name":"Output"}}},"pos":[-242.14825439453125,-3.725799560546875],"id":1,"input":{},"values":{"seed":1,"size":"12","density":0.5}}},"right":{"id":3,"name":"out","node":{"type":{"id":3,"name":"Solid Color","values":{"color":{"name":"Color","type":"color"}},"output":{"out":{"type":"FrameBuffer","name":"Output"}}},"pos":[-274.390625,94.63348388671875],"id":3,"input":{},"values":{"color":{"r":255,"g":0,"b":0,"a":1}}}}},"values":{"mode":"Multiply","factor":"1"}}}},"values":{},"type":{"id":0,"name":"Output","input":{"finalResult":{"type":"FrameBuffer","name":"Final result"}},"output":{},"values":{}}}]',    0
);