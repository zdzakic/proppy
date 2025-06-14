from django.db import models

class Owner(models.Model):
    name = models.CharField(max_length=100)
    date_left = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    comments = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Property(models.Model):
    name = models.CharField(max_length=100)
    block_id = models.IntegerField()
    comment = models.TextField(blank=True)
    owners = models.ManyToManyField(Owner, related_name='properties')

    def __str__(self):
        return self.name
