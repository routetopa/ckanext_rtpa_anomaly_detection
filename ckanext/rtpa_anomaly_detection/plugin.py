import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit
from pylons import config


class Rtpa_Anomaly_DetectionPlugin(plugins.SingletonPlugin):
	plugins.implements(plugins.IConfigurer)
	plugins.implements(plugins.IResourceView, inherit=True)

    # IConfigurer

	def update_config(self, config_):
		toolkit.add_template_directory(config_, 'templates')
		toolkit.add_public_directory(config_, 'public')
		toolkit.add_resource('fanstatic', 'rtpa_anomaly_detection')
        
        
	def info(self):
		return { 
				'name': 'rtpa_anomaly_detection',
				'title': 'AD',
				'icon': 'table',
				'default_title': 'Anomaly Detection',
				}

	def getResourceURL(self,context,data_dict):
		datasetId=(data_dict['resource']['id'])
		ckanurl=config.get('ckan.site_url', '')
		datadownloadurl=ckanurl+'/api/3/action/datastore_search?resource_id='+datasetId
		return datadownloadurl
		
	def can_view(self, data_dict):
		return True
	
	def view_template(self, context, data_dict):
		return "rtpa_anomaly_detection-view.html"
		
	def setup_template_variables(self, context, data_dict):
		DataUrl=self.getResourceURL(context,data_dict)
		return {'resource_url': DataUrl}
		
