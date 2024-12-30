const Module = require('../models/Module');
const Course = require('../models/Course');


exports.addModule = async (req, res) => {
  const { courseId, title, description, lessons } = req.body;

  try {

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const module = new Module({
      course: courseId,
      title,
      description,
      lessons,
    });
    await module.save();


    course.modules.push(module._id);
    await course.save();

    res.status(201).json({ message: 'Module added successfully', module });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getModulesByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const modules = await Module.find({ course: courseId });
    res.status(200).json({ modules });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateModule = async (req, res) => {
  const { moduleId } = req.params;
  const updates = req.body;

  try {
    const module = await Module.findByIdAndUpdate(moduleId, updates, { new: true });
    if (!module) return res.status(404).json({ error: 'Module not found' });

    res.status(200).json({ message: 'Module updated successfully', module });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteModule = async (req, res) => {
  const { moduleId } = req.params;

  try {
    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ error: 'Module not found' });

    // Remove module reference from the course
    const course = await Course.findById(module.course);
    if (course) {
      course.modules = course.modules.filter((id) => id.toString() !== moduleId);
      await course.save();
    }

    await module.deleteOne();
    res.status(200).json({ message: 'Module deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
