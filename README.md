### Pomodoro Planner

Leaf Lens is a full-stack plant disease detection app built to detect various diseases in plants. The app takes in plant images, performs object detection to isolate leaves, removes visual noise, and classifies each isolated image before presenting a summary of the plant's health. The project utilised and retrained an AlexNet model and a YOLOv8 model on a custom dataset for multi-class classification. The app was designed to reduce plant loss at early stages in agricultural land through easy, accessible detection.

### How it works
The app takes in an image you take using your phone or camera it sends it to the backend the backend feeds it to the yolov8 object detection model which was trained on webscraped leaf images which breaks the images by the leaf using bbox coordinates and then Alexnet CNN model runs on it which was trained using Huggingface dataset with dataset for different plant diseases. The images are classified and saved in database which is then returned to the user when they preview the page 
