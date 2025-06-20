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


class Insurance(models.Model):
    """
    Represents an insurance record associated with a specific insurance company.
    The company field is a foreign key to the Company model (tblCompanies),
    matching the structure shown in the Access DB diagram (inscompanyid → companyid).
    """
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='insurances')
    insurance_type = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    provider = models.CharField(max_length=255)
    provider_reference = models.CharField(max_length=100, blank=True) 

    def __str__(self):
        return f"{self.insurance_type} ({self.company.name})"



class HealthSafety(models.Model):
    """
    Represents a Health & Safety record linked to a specific company.
    Follows structure from MS Access table 'tblHanS'.
    """
    company = models.ForeignKey('Company', on_delete=models.CASCADE, related_name='health_safety_docs')
    document_type = models.CharField(max_length=100)  # hanstype
    start_date = models.DateField()  # hansdtstart
    end_date = models.DateField(null=True, blank=True)  # hansdtend
    provider = models.TextField()  # hansprovider
    provider_reference = models.CharField(max_length=100, blank=True)  # provnumber
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # hansamount

    def __str__(self):
        return f"{self.document_type} ({self.company.name})"

