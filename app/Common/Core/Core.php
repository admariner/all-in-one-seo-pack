<?php
namespace AIOSEO\Plugin\Common\Core;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use AIOSEO\Plugin\Common\Options;
use AIOSEO\Plugin\Common\Utils;

/**
 * Loads core classes.
 *
 * @since 4.1.9
 */
class Core {
	/**
	 * List of AIOSEO tables.
	 *
	 * @since 4.2.5
	 *
	 * @var array
	 */
	private $aioseoTables = [
		'aioseo_cache',
		'aioseo_crawl_cleanup_blocked_args',
		'aioseo_crawl_cleanup_logs',
		'aioseo_links',
		'aioseo_links_suggestions',
		'aioseo_notifications',
		'aioseo_posts',
		'aioseo_redirects',
		'aioseo_redirects_404',
		'aioseo_redirects_404_logs',
		'aioseo_redirects_hits',
		'aioseo_redirects_logs',
		'aioseo_terms',
		'aioseo_search_statistics_objects',
		'aioseo_revisions'
	];

	/**
	 * Filesystem class instance.
	 *
	 * @since 4.2.7
	 *
	 * @var Utils\Filesystem
	 */
	public $fs = null;

	/**
	 * Assets class instance.
	 *
	 * @since 4.2.7
	 *
	 * @var Utils\Assets
	 */
	public $assets = null;

	/**
	 * DB class instance.
	 *
	 * @since 4.2.7
	 *
	 * @var Utils\Database
	 */
	public $db = null;

	/**
	 * Cache class instance.
	 *
	 * @since 4.2.7
	 *
	 * @var Utils\Cache
	 */
	public $cache = null;

	/**
	 * NetworkCache class instance.
	 *
	 * @since 4.2.7
	 *
	 * @var Utils\NetworkCache
	 */
	public $networkCache = null;

	/**
	 * CachePrune class instance.
	 *
	 * @since 4.2.7
	 *
	 * @var Utils\CachePrune
	 */
	public $cachePrune = null;

	/**
	 * Options Cache class instance.
	 *
	 * @since 4.2.7
	 *
	 * @var Options\Cache
	 */
	public $optionsCache = null;

	/**
	 * Class constructor.
	 *
	 * @since 4.1.9
	 */
	public function __construct() {
		$this->fs           = new Utils\Filesystem( $this );
		$this->assets       = new Utils\Assets( $this );
		$this->db           = new Utils\Database();
		$this->cache        = new Utils\Cache();
		$this->networkCache = new Utils\NetworkCache();
		$this->cachePrune   = new Utils\CachePrune();
		$this->optionsCache = new Options\Cache();
	}

	/**
	 * Removes all our tables and options.
	 *
	 * @since 4.2.3
	 *
	 * @param  bool $force Whether we should ignore the uninstall option or not. We ignore it when we reset all data via the Debug Panel.
	 * @return void
	 */
	public function uninstallDb( $force = false ) {
		// Don't call `aioseo()->options` as it's not loaded during uninstall.
		$aioseoOptions = get_option( 'aioseo_options', '' );
		$aioseoOptions = json_decode( $aioseoOptions, true );

		// Confirm that user has decided to remove all data, otherwise stop.
		if (
			! $force &&
			empty( $aioseoOptions['advanced']['uninstall'] )
		) {
			return;
		}

		// Delete all our custom tables.
		global $wpdb;

		// phpcs:disable WordPress.DB.DirectDatabaseQuery
		foreach ( $this->getDbTables() as $tableName ) {
			$wpdb->query( $wpdb->prepare( 'DROP TABLE IF EXISTS %i', $tableName ) );
		}

		// Delete all AIOSEO Locations and Location Categories.
		$wpdb->delete( $wpdb->posts, [ 'post_type' => 'aioseo-location' ], [ '%s' ] );
		$wpdb->delete( $wpdb->term_taxonomy, [ 'taxonomy' => 'aioseo-location-category' ], [ '%s' ] );

		// Delete all the plugin settings.
		$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s", 'aioseo\_%' ) );

		// Remove any transients we've left behind.
		$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s", '\_aioseo\_%' ) );
		$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s", 'aioseo\_%' ) );

		// Delete all entries from the action scheduler table.
		$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->prefix}actionscheduler_actions WHERE hook LIKE %s", 'aioseo\_%' ) );
		$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->prefix}actionscheduler_groups WHERE slug = %s", 'aioseo' ) );
		// phpcs:enable
	}

	/**
	 * Get all the DB tables with prefix.
	 *
	 * @since 4.2.5
	 *
	 * @return array An array of tables.
	 */
	public function getDbTables() {
		global $wpdb;

		$tables = [];
		foreach ( $this->aioseoTables as $tableName ) {
			$tables[] = $wpdb->prefix . $tableName;
		}

		return $tables;
	}

	/**
	 * Check if the current request is uninstalling (deleting) AIOSEO.
	 *
	 * @since 4.3.7
	 *
	 * @return bool Whether AIOSEO is being uninstalled/deleted or not.
	 */
	public function isUninstalling() {
		if (
			defined( 'AIOSEO_FILE' ) &&
			defined( 'WP_UNINSTALL_PLUGIN' )
		) {
			// Make sure `plugin_basename()` exists.
			include_once ABSPATH . 'wp-admin/includes/plugin.php';

			return WP_UNINSTALL_PLUGIN === plugin_basename( AIOSEO_FILE );
		}

		return false;
	}
}