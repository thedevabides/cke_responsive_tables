<?php

namespace Drupal\cke_responsive_tables\Plugin\CKEditorPlugin;

use Drupal\ckeditor\CKEditorPluginBase;
use Drupal\editor\Entity\Editor;

/**
 * Defines the "Responsive Tables" plugin.
 *
 * @CKEditorPlugin(
 *   id = "responsivetables",
 *   label = @Translation("Responsive Tables"),
 *   module = "cke_responsive_tables"
 * )
 */
class ResponsiveTables extends CKEditorPluginBase {

  /**
   * {@inheritdoc}
   */
  public function getFile() {
    return drupal_get_path('module', 'cke_responsive_tables') . '/ckeditor/plugins/responsivetables/plugin.js';
  }

  /**
   * {@inheritdoc}
   */
  public function getDependencies(Editor $editor) {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function getLibraries(Editor $editor) {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function isInternal() {
    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function getButtons() {
    $template = '
        <a href="#" role="button" aria-label="{{ styles_text }}">
            <span class="ckeditor-button-dropdown">{{ styles_text }}
                <span class="ckeditor-button-arrow"></span>
            </span>
        </a>
    ';
    return [
      'CollapseTable' => [
        'label' => $this->t('Collapse Table'),
        'image_alternative' => [
          '#type' => 'inline_template',
          '#template' => $template,
          '#context' => [
            'styles_text' => $this->t('Collapse Table'),
          ],
        ],
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function isEnabled(Editor $editor) {}

  /**
   * {@inheritdoc}
   */
  public function getConfig(Editor $editor) {
    return [
      'tableCollapse_options' => $this->buildOptions(),
    ];
  }

  /**
   * {@inheritdoc}
   */
  protected function buildOptions() {}

}
