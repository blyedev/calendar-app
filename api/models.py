from django.db import models

# Create your models here.

class TreeNode(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    parent = models.ForeignKey(
        'self',
        related_name='children',
        null=True,
        blank=True,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return self.title

class Event(TreeNode):
    event_start_datetime = models.DateTimeField()
    event_end_datetime = models.DateTimeField()

class Task(TreeNode):
    due_date = models.DateField()
    priority = models.CharField(max_length=20, choices=[('Low', 'Low'), ('Medium', 'Medium'), ('High', 'High')])

class Project(TreeNode):
    pass

class Group(TreeNode):
    pass
