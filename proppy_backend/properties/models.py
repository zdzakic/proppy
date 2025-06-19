from django.db import models
from django.conf import settings


class Company(models.Model):
    name = models.CharField(max_length=255)         
    address = models.TextField()                    
    is_valid = models.BooleanField(default=True)    
    comment = models.TextField(blank=True)          

    def __str__(self):
        return self.name


class Block(models.Model):
    name = models.CharField(max_length=255)            
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='blocks') 
    comment = models.TextField(blank=True)         

    def __str__(self):
        return self.name


class Property(models.Model):
    name = models.CharField(max_length=255)  # propertyname
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='properties')
    block = models.ForeignKey(Block, on_delete=models.SET_NULL, null=True, blank=True)
    comment = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Ownership(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ownerships')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='ownerships')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)  # null znači da je još uvijek aktivno
    comment = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.email} → {self.property.name} ({self.start_date} to {self.end_date or 'present'})"

